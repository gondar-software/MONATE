import CardLoading from "./card-loading";

export const Card = (props: any) => {
    return (
        <div className='w-full h-full max-w-sm'>
            {!props.loading ? <div className="w-full h-full">{props.children}</div> : <CardLoading />}
        </div>
    );
};

export default Card;