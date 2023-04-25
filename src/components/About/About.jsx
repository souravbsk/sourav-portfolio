import React from "react";
import Lottie from "lottie-react";
import codingImg from "../../assets/Image/about.json";
import { Tilt } from "react-tilt";

const About = () => {
  return (
    <div className="container  py-24">
      <div className="text-center">
        <h2 className="text-5xl font-bold">About Me</h2>
      </div>
      <div className="flex gap-8 flex-col md:flex-row justify-between items-center">
        <Tilt>
          <Lottie
            className="flex-shrink"
            animationData={codingImg}
            loop={true}
          />
        </Tilt>
        <div className="flex-1">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus
          tempora quia dolorem facilis rerum temporibus doloribus excepturi
          perspiciatis suscipit vero eum commodi cumque, nemo quas, neque
          distinctio maiores voluptatibus reprehenderit et odit consequatur
          quaerat impedit cupiditate! Obcaecati quae ut soluta numquam
          recusandae debitis laudantium, ratione tempora nisi cupiditate, quod
          hic doloribus a repellendus eaque nemo vitae ex veritatis ipsa et
          minima laborum omnis. Repudiandae vero necessitatibus earum inventore,
          possimus laborum dolore voluptatibus asperiores placeat id esse nihil
          voluptate a rerum deleniti, ex quasi vel! Aperiam aliquid aspernatur
          necessitatibus asperiores quis deleniti non eaque est, explicabo
          magnam natus perspiciatis alias quia molestias assumenda minima
          maiores quaerat iste sapiente? Asperiores, quia molestias beatae unde
          commodi numquam itaque amet, omnis, facere libero magnam hic sed
          incidunt nemo aut explicabo quod tempora aliquid atque. Labore commodi
          quia esse error adipisci alias nam ipsam corporis cupiditate, quos
          animi cum quo incidunt aut perspiciatis vitae velit!
          <br />
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos nostrum
          perferendis consectetur magnam vero laborum exercitationem, maiores
          quam distinctio. Id expedita voluptatem recusandae libero cupiditate,
          tempora totam aliquid maiores optio numquam, doloremque, quaerat
          placeat cumque blanditiis perspiciatis deserunt? Perferendis, numquam
          odit saepe fuga rem hic eveniet suscipit. Alias tempore eligendi
          labore consequatur?
        </div>
      </div>
    </div>
  );
};

export default About;
