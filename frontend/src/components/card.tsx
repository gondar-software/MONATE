import CardLoading from "./card-loading";

export const Card = (props: any) => {
    return (
        <div className='w-full max-w-sm'>
            {props.children}
            <CardLoading className={`w-full h-full ${props.loading ? 'visible' : 'hidden'}`} />
        </div>
    );
};

export default Card;