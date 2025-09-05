import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

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

// new k8s.apps.v1.Deployment(appName, {
// 	metadata: {
// 		namespace: namespace.metadata.name
// 	},
// 	spec: {
// 		strategy: {
// 			type: "RollingUpdate",
// 			rollingUpdate: {
// 				maxSurge: 2,
// 				maxUnavailable: 1
// 			}
// 		},
// 		selector: { matchLabels: appLabels },
// 		replicas,
// 		template: {
// 			metadata: { labels: appLabels },
// 			spec: {
// 				containers: [
// 					{
// 						name: "backend",
// 						image: backendImage.imageName,
// 						imagePullPolicy: "Always",
// 						ports: [
// 							{
// 								containerPort: 3000,
// 								name: "frcn-backend"
// 							}
// 						],
// 						env: ["LOCAL_ACCESS_TOKEN"].map((name) => ({
// 							name,
// 							value: process.env[name]
// 						})),
// 						readinessProbe: {
// 							httpGet: {
// 								path: "/health",
// 								port: "frcn-backend"
// 							},
// 							successThreshold: 2,
// 							periodSeconds: 10,
// 							timeoutSeconds: 5
// 						}
// 					},
// 					{
// 						name: "website",
// 						image: webImage.imageName,
// 						imagePullPolicy: "Always",
// 						ports: [
// 							{
// 								containerPort: 3000,
// 								name: "frcn-website"
// 							}
// 						],
// 						env: ["PUBLIC_API_BASEURL", "LOCAL_ACCESS_TOKEN"].map((name) => ({
// 							name,
// 							value: process.env[name]
// 						})),
// 						readinessProbe: {
// 							httpGet: {
// 								path: "/",
// 								port: "frcn-website"
// 							},
// 							successThreshold: 2,
// 							periodSeconds: 10,
// 							timeoutSeconds: 5
// 						}
// 					}
// 				],
// 				imagePullSecrets: [{ name: "ecr-reg-creds" }]
// 			}
// 		}
// 	}
// });

// const backendService = new k8s.core.v1.Service(`${appName}-backend`, {
// 	metadata: {
// 		namespace: namespace.metadata.name,
// 		name: `${appName}-backend`,
// 		labels: appLabels
// 	},
// 	spec: {
// 		ports: [{ port: 80, targetPort: "frcn-backend" }],
// 		selector: appLabels
// 	}
// });

// const websiteService = new k8s.core.v1.Service(`${appName}-website`, {
// 	metadata: {
// 		namespace: namespace.metadata.name,
// 		name: `${appName}-website`,
// 		labels: appLabels
// 	},
// 	spec: {
// 		ports: [{ port: 80, targetPort: "frcn-website" }],
// 		selector: appLabels
// 	}
// });

// const ingress = new k8s.networking.v1.Ingress(`${appName}-ingress`, {
// 	metadata: {
// 		namespace: namespace.metadata.name,
// 		name: `${appName}-ingress`,
// 		annotations: {
// 			"kubernetes.io/ingress.class": "nginx"
// 		}
// 	},
// 	spec: {
// 		rules: [
// 			{
// 				host: "api.frontierconsolidated.com",
// 				http: {
// 					paths: [
// 						{
// 							pathType: "Prefix",
// 							path: "/",
// 							backend: {
// 								service: {
// 									name: backendService.metadata.name,
// 									port: { number: 80 }
// 								}
// 							}
// 						}
// 					]
// 				}
// 			},
// 			{
// 				host: "frontierconsolidated.com",
// 				http: {
// 					paths: [
// 						{
// 							pathType: "Prefix",
// 							path: "/",
// 							backend: {
// 								service: {
// 									name: websiteService.metadata.name,
// 									port: { number: 80 }
// 								}
// 							}
// 						}
// 					]
// 				}
// 			}
// 		]
// 	}
// });

export const ingressStatus = ingress.status;
