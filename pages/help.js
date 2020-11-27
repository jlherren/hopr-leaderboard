import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout.js";
import TweetBasodino from "../components/tweet-basodino";
import api from "../utils/api";

export default function Help() {
  const [hash, setHash] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getAllData();
      if (response.data) setHash(response.data.address);
    };
    fetchData();
  }, []);

  const showCopyCode = () => {
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 800);
  };

  const copyCodeToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showCopyCode();
  };

  return (
    <>
      <Layout toggle={showMsg}>
        <div className="box help-area">
          <div className="box-top-area">
            <div>
              <div className="box-title">
                <h1>Instructions</h1>
              </div>
              <div className="box-btn">
                <p>v0.06</p>
              </div>
            </div>
          </div>

          <div className="box-main-area">
            <div className="quick-code">
              <small>Registration is now closed. If you participated in Basòdino v1, you are already registered. Check into Telegram each day at 3pm CET for a new task. Visit docs.hoprnet.org for more instructions.</small>
            </div>
            <hr />
            <ol>
              <li>
                Install the latest version of{" "}
                <a
                  href="https://github.com/hoprnet/hopr-chat/releases"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span> HOPR Chat</span>
                </a>
                , which will spin up a HOPR node.
              </li>
              <li>
                Send <strong>0.02 Matic</strong> to your node. You can get Matic
                from ETH on{" "}
                <a
                  href="//wallet.matic.network"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>wallet.matic.network</span>
                </a>{" "}
                or ping us on{" "}
                <a href="//t.me/hoprnet" target="_blank" rel="noreferrer">
                  <span>Telegram</span>
                </a>
                .
              </li>
              <li>
                In your HOPR node, type <strong>myAddress</strong> to find your
                node address.
              </li>
              <li>
                Tweet your HOPR node address with the tag{" "}
                <strong>#Basodino</strong> and <strong>@hoprnet</strong>.{" "}
                <TweetBasodino>
                  <img src="/assets/icons/twitter.svg" alt="twitter" />{" "}
                  <span>#Basodino</span>
                </TweetBasodino>
              </li>
              <li>
                In your HOPR node, type{" "}
                <strong>settings includeRecipient true</strong> so the bot can
                respond.
              </li>
              <li>
                Send the URL of your tweet to the <strong>CoverBot</strong>{" "}
                using the <strong>send</strong> command. You may need to use{" "}
                <strong>crawl</strong> first.
                <br />
                <div className="quick-code">
                  <div className="hash" onClick={() => copyCodeToClipboard(hash)}>
                    <p>{hash}</p>
                    <div>
                      <img style={{ marginLeft: 8 }} src="/assets/icons/copy.svg" alt="copy" />
                    </div>
                  </div>
                </div>
              </li>
              <li>Wait for a message from CoverBot verifying your tweet.</li>
              <li>
                You have scored points! Keep your node online to earn more!
              </li>
              <li>
                Every 10s, CoverBot will randomly choose a registered user to
                relay data and earn more points.
              </li>
            </ol>
            <hr />
            <div className="twitter-line-menu">
              <a
                className="aux-help-twitter"
                href="https://twitter.com/hoprnet"
                target="_blank"
              >
                <div>
                  <img src="/assets/icons/twitter.svg" alt="twitter" />
                </div>
                <div>
                  <p>@hoprnet</p>
                  <span>click here to tweet</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
