import './style.scss'

type PropsType = {
    text: string,
    onClick?: () => void
};

export default function Button (props: PropsType) {
    const { text, onClick } = props;

    return (
        <button className='button' onClick={onClick}>{text}</button>
    )
}
