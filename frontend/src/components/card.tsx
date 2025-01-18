import CardLoading from "./card-loading";

export const Card = (props: any) => {
    return (
        <div className='max-w-sm w-full h-full'>
            {!props.loading ? <div className="w-full h-full">{props.children}</div> : <CardLoading />}
        </div>
    );
};

export default Card;