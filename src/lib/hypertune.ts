import "server-only";
import { createSource } from "../../generated/hypertune";

const hypertuneSource = createSource({
    token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!,
});

export default async function getHypertune() {
    await hypertuneSource.initIfNeeded(); // Check for flag updates

    return hypertuneSource.root({
        args: {
            context: {
                environment: process.env.NODE_ENV,
                user: { id: "1", name: "Test", email: "test@example.com" },
            },
        },
    });
}
