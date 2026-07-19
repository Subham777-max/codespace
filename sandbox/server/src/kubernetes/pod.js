import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId){
    const podManifest = {
        metadata: {
            name: `sandbox-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId: sandboxId
            }
        },
        spec: {
            containers: [
                {
                    image: "template:latest",
                    imagePullPolicy: "IfNotPresent",
                    name: "sandbox-container",
                    ports: [
                        {
                            containerPort: 5173,
                            name: "http"
                        }
                    ],
                    resources:{
                        limits: {
                            cpu: "500m",
                            memory: "512Mi"
                        },
                        request:{
                            cpu: "250m",
                            memory: "256Mi"
                        }
                    }
                }
            ]
        }
    };
    return await k8sCoreV1Api.createNamespacedPod({
        namespace: "default",
        body: podManifest
    });
}