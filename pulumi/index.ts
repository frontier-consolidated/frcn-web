import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const appName = "frcn-web";
const appLabels = { app: appName };
const replicas = 1;
const port = 3000;
const portName = `${appName}-port`;

const config = new pulumi.Config();
const repositoryName = config.require("repositoryName");

const repository = new aws.ecr.Repository(repositoryName);

const _repoLifecyclePolicy = new aws.ecr.LifecyclePolicy(`${repositoryName}-lifecycle-policy`, {
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

const imageName = repository.repositoryUrl;
const registry = repository.registryId.apply(async (id) => {
	const credentials = await aws.ecr.getCredentials({ registryId: id });
	const decodedCredentials = Buffer.from(credentials.authorizationToken, "base64").toString();
	const [username, password] = decodedCredentials.split(":");
	if (!password || !username) {
		throw new Error("Invalid credentials");
	}
	return {
		server: credentials.proxyEndpoint,
		username: username,
		password: password
	};
});

const image = new docker.Image(`${appName}-image`, {
	build: {
		context: "../",
		dockerfile: "../Dockerfile",
		platform: "linux/amd64",
		args: {
			PUBLIC_POSTHOG_KEY: config.require("public:posthogKey")
		}
	},
	imageName,
	registry
});

export const baseImageName = image.baseImageName;
export const fullImageName = image.imageName;

const namespace = new k8s.core.v1.Namespace(appName, {
	metadata: {
		name: appName
	}
});

const _app = new k8s.apps.v1.Deployment(appName, {
	metadata: {
		namespace: namespace.metadata.name
	},
	spec: {
		selector: { matchLabels: appLabels },
		replicas,
		template: {
			metadata: { labels: appLabels },
			spec: {
				containers: [
					{
						name: appName,
						image: image.imageName,
						ports: [
							{
								containerPort: port,
								name: portName
							}
						]
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
