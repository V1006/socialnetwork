import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Podcast() {
    const [podcast, setPodcast] = useState({});
    const { podcastName } = useParams();
    useEffect(() => {
        async function getPodcast(name) {
            const response = await fetch(`/api/podcast/${name}`);
            const ParsedJSON = await response.json();
            setPodcast(ParsedJSON);
        }
        getPodcast(podcastName);

        /*    const dateString = new Intl.DateTimeFormat("de-DE", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date(podcast.created_at)); */

        /* setTimeStamp(dateString); */
    }, []);

    /* useEffect(() => {
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const dateString = new Date(podcast.created_at);

        const date =
            monthNames[dateString.getMonth()] + " " + dateString.getFullYear();

        setTimeStamp(date);
    }, [podcast]); */

    return (
        <section className="podMainContainer">
            <div className="podHeaders">
                <h1 className="podInfo">{podcast.info}</h1>
                <h4 className="podSubInfo"> New episode every Monday.</h4>
            </div>
            <div className="podContentContainer">
                <iframe
                    className="audio2"
                    src={podcast.spotify_src}
                    frameBorder="0"
                    allowfullscreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                ></iframe>
            </div>
        </section>
    );
}
