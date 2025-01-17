import CardLoading from "./card-loading";

export const Card = (props: any) => {
    return (
        <div className='max-w-sm'>
            {props.children.map((child: any) => (
                <div className="w-full h-full">
                    {!props.loading ?
                        <div className="w-full h-full">
                            {typeof(child) === typeof(CardHeader) && 
                                <div className="w-full h-1/4">{child}</div>}
                            {typeof(child) === typeof(CardBody) &&
                                <div className="w-full h-auto">{child}</div>}
                            {typeof(child) === typeof(CardFooter) &&
                                <div className="w-full h-1/6">{child}</div>}
                        </div> : <CardLoading />}
                </div>
            ))}
        </div>
    );
};

export const CardHeader = (props: any) => {
    return (
        <div className="w-full h-full">
            {props.children}
        </div>
    );
};

export const CardBody = (props: any) => {
    return (
        <div className="w-full h-full">
            {props.children}
        </div>
    );
};

export const CardFooter = (props: any) => {
    return (
        <div className="w-full h-full">
            {props.children}
        </div>
    );
};