"use client";

import Link from "next/link";
import { useClassicMode } from "@/lib/classic-mode";

export function ClassicHome({
  suttaCount,
  articleCount,
}: {
  suttaCount: number;
  articleCount: number;
}) {
  const { isClassic } = useClassicMode();

  if (!isClassic) return null;

  return (
    <div style={{ width: 680, margin: "0 auto", color: "#111", fontFamily: 'Verdana, Arial, sans-serif', fontSize: "0.9em", lineHeight: "1.1em", textAlign: "left", paddingTop: 10 }}>
      {/* Billboard */}
      <div style={{ borderBottom: "1px solid #ccc", minHeight: 180, marginBottom: 10, position: "relative" }}>
        {/* Banner image (mainsail) */}
        <div style={{ float: "left", width: 430, marginTop: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/banner3.gif"
            height={118}
            width={450}
            alt="Access to Insight: Readings in Theravada Buddhism"
          />
        </div>
        {/* Dhammapada quote (jib) */}
        <div style={{ float: "right", width: 200, height: 120 }}>
          <div style={{ marginTop: 25, marginLeft: 20, height: 80, font: "9pt/12pt sans-serif", textAlign: "left", fontStyle: "italic" }}>
            The non-doing of any evil,<br />
            the performance of what&apos;s skillful,<br />
            the cleansing of one&apos;s own mind:<br />
            &nbsp;&nbsp;&nbsp;this is the teaching<br />
            &nbsp;&nbsp;&nbsp;of the Awakened.{" "}
            <Link href="/tipitaka/kn/dhp/dhp.14.than" aria-label="Source: Dhammapada, Chapter 14">&bull;</Link>
          </div>
        </div>
        <div style={{ clear: "both" }} />
      </div>

      {/* Content */}
      <div style={{ width: 660, lineHeight: "130%", padding: "0 10px 10px 10px" }}>
        <dl style={{ margin: "1.33em 0" }}>
          <dt style={{ fontWeight: "bold" }}>
            <Link href="/begin">Beginnings</Link>:
          </dt>
          <dd style={{ margin: "0 0 1em 1.33em" }}>
            <Link href="/theravada">What is Theravada Buddhism?</Link>
            {" / "}
            <Link href="/befriending">Befriending the suttas</Link>
            {" / "}
            <Link href="/guides">Self-guided tour of the Buddha&apos;s teachings</Link>
          </dd>

          <dt style={{ fontWeight: "bold" }}>
            <Link href="/tipitaka">Tipitaka</Link>:
          </dt>
          <dd style={{ margin: "0 0 1em 1.33em" }}>
            Modern translations of more than {suttaCount.toLocaleString()} important suttas from the Pali canon, indexed by{" "}
            <Link href="/indexes/sutta">sutta</Link>,{" "}
            <Link href="/indexes/subject">subject</Link>,{" "}
            <Link href="/indexes/names">proper name</Link>,{" "}
            <Link href="/indexes/similes">simile</Link>,{" "}
            <Link href="/authors">translator</Link>
            {" / "}
            <Link href="/tipitaka/dn">DN</Link>
            {" / "}
            <Link href="/tipitaka/mn">MN</Link>
            {" / "}
            <Link href="/tipitaka/sn">SN</Link>
            {" / "}
            <Link href="/tipitaka/an">AN</Link>
            {" / "}
            <Link href="/tipitaka/kn">KN</Link>
          </dd>

          <dt style={{ fontWeight: "bold" }}>
            <Link href="/authors">Library</Link>:
          </dt>
          <dd style={{ margin: "0 0 1em 1.33em" }}>
            <Link href="/authors">Authors</Link>
            {" / "}
            <Link href="/guides">Study guides</Link>
            {" / "}
            Indexes by{" "}
            <Link href="/indexes/author">author</Link>,{" "}
            <Link href="/indexes/title">title</Link>, and{" "}
            <Link href="/indexes/subject">subject</Link>
          </dd>

          <dt style={{ fontWeight: "bold" }}>
            Help:
          </dt>
          <dd style={{ margin: "0 0 1em 1.33em" }}>
            <Link href="/indexes/subject">Index</Link>
            {" / "}
            <Link href="/glossary">Glossary</Link>
            {" / "}
            <Link href="/search">Search</Link>
          </dd>
        </dl>
      </div>
    </div>
  );
}
