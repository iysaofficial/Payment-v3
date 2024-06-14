import React, { useEffect } from "react";

export default function Home() {
  return (
    <section className="index-section">
      <div class="wrapper">
        <div class="text-center">
          <h2 class="mx-auto">REGISTRATION FORM</h2>
          <h1 class="mx-auto">
            Choose Categories Participant for Registration IYBC 2024
          </h1>
        </div>
      </div>
      <div class="link-web mx-auto text-center">
        <a
          href="/indonesiaparticipants"
          class="btn btn--primary text-center mt-5"
        >
          Indonesia Participant{" "}
          <i class="&nbsp; fa-solid fa-earth-americas"></i>
        </a>
        <a
          href="/internationalparticipants"
          class="btn btn--accent text-center mt-5"
        >
          International Participant{" "}
          <i class="&nbsp; fa-solid fa-earth-americas"></i>
        </a>
      </div>
    </section>
  );
}
