import { identifyPlant, toBase64 } from "lib/api/plantId";
import { useEffect } from "react";
import styles from "./Home.module.scss";

const Home = () => {
    useEffect(() => {
        //const image = document.getElementById("plant-img") as HTMLImageElement;
        //console.log(identifyPlant(toBase64(image)));
    }, []);

    return (
        <div className={styles.home_wrapper}>
            <p className="text">hey</p>
            <img
                id="plant-img"
                src="https://s3.amazonaws.com/finegardening.s3.tauntoncloud.com/app/uploads/vg-migration/2019/09/28011137/Shishito_containers.JPG"
                alt=""
            />
        </div>
    );
};

export default Home;
