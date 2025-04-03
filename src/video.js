function Video({title="sample", channel, views}){
    return(
        <>
    <div style={{color:"blue"}}>{title}</div>
    <div>{channel}</div>
    <div>{views}</div>
    </>
    );
}
export default Video;