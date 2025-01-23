import { useLightMode } from "@app/global";
import { Card } from "@app/components";

export const AuthCard = (props: any) => {
    const lightMode = useLightMode();

    return (
        <div {...props}>
            <Card>
            </Card>
        </div>
    );
};