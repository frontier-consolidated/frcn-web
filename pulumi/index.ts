import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const baseDomain = "frontierconsolidated.com";
const webDomain = `${pulumi.getStack() === "prod" ? "" : `${pulumi.getStack()}.`}${baseDomain}`;
const apiSubDomain = `${pulumi.getStack() === "prod" ? "" : `${pulumi.getStack()}-`}api`;
const apiDomain = `${apiSubDomain}.${baseDomain}`;

const appName = "frcn-web";
const appLabels = { app: appName };
const replicas = 1;

const config = new pulumi.Config();
const repositoryName = config.require("repositoryName");

const repository = new aws.ecr.Repository(repositoryName);

new aws.ecr.LifecyclePolicy(`${repositoryName}-lifecycle-policy`, {
	repository: repository.name,
	policy: {
		rules: [
			{
				rulePriority: 1,
				description: "Remove untagged images",
				selection: {
					tagStatus: "untagged",
					countType: "imageCountMoreThan",
					countNumber: 1
				},
				action: {
					type: "expire"
				}
			}
		]
	}
});

const registry = aws.ecr
	.getAuthorizationTokenOutput({
		registryId: repository.registryId
	})
	.apply(async (credentials) => {
		return {
			server: credentials.proxyEndpoint,
			username: credentials.userName,
			password: pulumi.secret(credentials.password)
		};
	});

const backendImage = new docker.Image(`${appName}-backend-image`, {
	build: {
		context: "../",
		dockerfile: "../Dockerfile",
		platform: "linux/amd64",
		target: "backend"
		// args: {
		// 	...buildArgs.reduce((args, name) => ({ ...args, [name]: process.env[name] }), {})
		// }
	},
	imageName: repository.repositoryUrl.apply((url) => `${url}/backend`),
	registry
});

const webImage = new docker.Image(`${appName}-web-image`, {
	build: {
		context: "../",
		dockerfile: "../Dockerfile",
		platform: "linux/amd64",
		target: "web"
	},
	imageName: repository.repositoryUrl.apply((url) => `${url}/web`),
	registry
});

const namespace = new k8s.core.v1.Namespace(appName, {
	metadata: {
		name: appName
	}
});

const deployment = new k8s.apps.v1.Deployment(appName, {
	metadata: {
		namespace: namespace.metadata.name
	},
	spec: {
		strategy: {
			type: "RollingUpdate",
			rollingUpdate: {
				maxSurge: 2,
				maxUnavailable: 1
			}
		},
		selector: { matchLabels: appLabels },
		replicas,
		template: {
			metadata: { labels: appLabels },
			spec: {
				containers: [
					{
						name: "backend",
						image: backendImage.imageName,
						imagePullPolicy: "Always",
						ports: [
							{
								containerPort: 3000,
								name: "frcn-backend"
							}
						],
						env: [
							{
								name: "PORT",
								value: "3000"
							},
							{
								name: "DOMAIN",
								value: baseDomain
							},
							{
								name: "SUB_DOMAIN",
								value: apiSubDomain
							},
							{
								name: "WEB_ORIGIN",
								value: `https://${webDomain}`
							},
							{
								name: "ACCESS_KEY_HEADER",
								value: "x-frcn-access-key"
							},
							{
								name: "CONSENT_COOKIE",
								value: `frcn${pulumi.getStack() === "prod" ? "" : `-${pulumi.getStack()}`}.consent`
							},
							{
								name: "DEVICE_TRACK_COOKIE",
								value: `frcn${pulumi.getStack() === "prod" ? "" : `-${pulumi.getStack()}`}.deviceid`
							},
							{
								name: "SESSION_COOKIE",
								value: `frcn${pulumi.getStack() === "prod" ? "" : `-${pulumi.getStack()}`}.sid`
							},
							...[
								"DATABASE_URL",
								"LOCAL_ACCESS_TOKEN",
								"SESSION_SECRET",
								"ADMIN_DISCORD_IDS",
								"DISCORD_CLIENTID",
								"DISCORD_SECRET",
								"DISCORD_TOKEN",
								"AWS_S3_BUCKET",
								"AWS_S3_REGION",
								"AWS_S3_KEY",
								"AWS_S3_SECRET"
							].map((name) => ({
								name,
								value: process.env[name]
							}))
						],
						readinessProbe: {
							httpGet: {
								path: "/health",
								port: "frcn-backend"
							},
							successThreshold: 2,
							periodSeconds: 10,
							timeoutSeconds: 5
						}
					},
					{
						name: "website",
						image: webImage.imageName,
						imagePullPolicy: "Always",
						ports: [
							{
								containerPort: 3000,
								name: "frcn-website"
							}
						],
						env: [
							{
								name: "PORT",
								value: "3000"
							},
							{
								name: "PUBLIC_API_BASEURL",
								value: "https://api.frontierconsolidated.com"
							},
							{
								name: "LOCAL_ACCESS_TOKEN",
								value: process.env.LOCAL_ACCESS_TOKEN
							}
						],
						readinessProbe: {
							httpGet: {
								path: "/",
								port: "frcn-website"
							},
							successThreshold: 2,
							periodSeconds: 10,
							timeoutSeconds: 5
						}
					}
				],
				imagePullSecrets: [{ name: "ecr-reg-creds" }]
			}
		}
	}
});

const backendService = new k8s.core.v1.Service(`${appName}-backend`, {
	metadata: {
		namespace: namespace.metadata.name,
		name: `${appName}-backend`,
		labels: appLabels
	},
	spec: {
		ports: [{ port: 80, targetPort: "frcn-backend" }],
		selector: appLabels
	}
});

const websiteService = new k8s.core.v1.Service(`${appName}-website`, {
	metadata: {
		namespace: namespace.metadata.name,
		name: `${appName}-website`,
		labels: appLabels
	},
	spec: {
		ports: [{ port: 80, targetPort: "frcn-website" }],
		selector: appLabels
	}
});

const ingress = new k8s.networking.v1.Ingress(`${appName}-ingress`, {
	metadata: {
		namespace: namespace.metadata.name,
		name: `${appName}-ingress`,
		annotations: {
			"kubernetes.io/ingress.class": "nginx"
		}
	},
	spec: {
		rules: [
			{
				host: apiDomain,
				http: {
					paths: [
						{
							pathType: "Prefix",
							path: "/",
							backend: {
								service: {
									name: backendService.metadata.name,
									port: { number: 80 }
								}
							}
						}
					]
				}
			},
			{
				host: webDomain,
				http: {
					paths: [
						{
							pathType: "Prefix",
							path: "/",
							backend: {
								service: {
									name: websiteService.metadata.name,
									port: { number: 80 }
								}
							}
						}
					]
				}
			}
		]
	}
});

export const ingressStatus = ingress.status;
export const deploymentStatus = deployment.status;
