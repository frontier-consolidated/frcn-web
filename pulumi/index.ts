import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const namespaceName = "frcn-web";

const appName = "frcn-web";
const appLabels = { app: appName };
const replicas = 1;
const port = 3000;
const portName = `${appName}-port`;

const buildArgs = ["PUBLIC_POSTHOG_KEY", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"];
const containerEnvVars = ["DATABASE_URL", "DISCORD_GUILD_ID", "DISCORD_CLIENT_ID", "DISCORD_TOKEN"];

function createRepository(name: string) {
	const repository = new aws.ecr.Repository(name);

	new aws.ecr.LifecyclePolicy(
		`${name}-lifecycle-policy`,
		{
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
		},
		{
			parent: repository
		}
	);

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

	return { repository, registry };
}

const config = new pulumi.Config();
const repositoryName = config.require("repositoryName");

const repository = createRepository(repositoryName);
const image = new docker.Image(`${appName}-image`, {
	build: {
		context: "../",
		dockerfile: "../Dockerfile",
		platform: "linux/amd64",
		args: {
			...buildArgs.reduce((args, name) => ({ ...args, [name]: process.env[name] }), {})
		}
	},
	imageName: repository.repository.repositoryUrl,
	registry: repository.registry
});

const namespace = new k8s.core.v1.Namespace(namespaceName, {
	metadata: {
		name: namespaceName
	}
});

new k8s.apps.v1.Deployment(appName, {
	metadata: {
		namespace: namespace.metadata.name
	},
	spec: {
		selector: { matchLabels: appLabels },
		replicas,
		strategy: {
			type: "RollingUpdate",
			rollingUpdate: {
				maxSurge: 1,
				maxUnavailable: 1
			}
		},
		template: {
			metadata: {
				labels: appLabels,
				annotations: {
					"ecr/image-digest": image.repoDigest
				}
			},
			spec: {
				containers: [
					{
						name: appName,
						image: image.imageName,
						imagePullPolicy: "Always",
						ports: [
							{
								containerPort: port,
								name: portName
							}
						],
						env: containerEnvVars.map((name) => ({ name, value: process.env[name] })),
						readinessProbe: {
							httpGet: {
								path: "/",
								port: portName
							},
							successThreshold: 2,
							failureThreshold: 2,
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

const appService = new k8s.core.v1.Service(appName, {
	metadata: {
		namespace: namespace.metadata.name,
		labels: appLabels
	},
	spec: {
		ports: [{ port: 80, targetPort: portName }],
		selector: appLabels
	}
});

const appIngress = new k8s.networking.v1.Ingress(`${appName}-ingress`, {
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
				host: "new.frontierconsolidated.com",
				http: {
					paths: [
						{
							pathType: "Prefix",
							path: "/",
							backend: {
								service: {
									name: appService.metadata.name,
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

export const appname = appService.metadata.name;
export const ingressStatus = appIngress.status;
