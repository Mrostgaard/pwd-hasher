import * as React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';
import jsSHA from "jssha";
import {getExtensionStorage} from '../utils/storage';
import { Settings, Copy } from 'react-feather';
import './styles.scss';

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}

const Popup = () => {
  const outputFormat = "B64";
  const [url, setUrl] = useState("");
  const [hash, setHash] = useState("");
  const [username, setUsername] = useState("");


  // let url = "";
  // let location = window.location.toString();
  // if(location.startsWith("http")) {
  //   url = location.split("://")[1].split("/")[0];
  // }
  // else {
  //   console.log("This is not a http protocol");
  //   url = "Not a website"
  // }

  useEffect(() => {
    async function readStorage(): Promise<void>{
      const {storage = {}} = await getExtensionStorage();
      const shaObj = new jsSHA("SHA3-256", "TEXT", { encoding: "UTF8" });
      const finalString = `${storage.passphrase.phrase}, ${url}, ${username}`;
      console.log(finalString);
      shaObj.update(finalString);
      setHash(shaObj.getHash(outputFormat));
    }

    readStorage();
  },[url, username]);
  useEffect(() => {
    async function readStorage(): Promise<void>{
      const {storage = {}} = await getExtensionStorage();
      setUsername(storage.username);
    }
    browser.windows.getCurrent((w:any) => {
      browser.tabs.query({active: true, windowId: w.id}, tabs => {
        setUrl(tabs[0].url.split("://")[1].split("/")[0].replace("www.", ""));
      });
    });

    readStorage();
  },[])


  const onChangeUrl= (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
  };
  const onChangeUsername= (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  return (
    <section id="popup">
      <div className="headline">
        <h2 style={{flexGrow: 100}}>PWD / HASHER</h2>
        <button
          id="options__button"
          type="button"
          className="button"
          onClick={(): Promise<Tabs.Tab> => {
            return openWebPage('options.html');
          }}
        >
          <Settings color="black" size={30} />
        </button>
      </div>
      <div className="links__holder">
        <div>
          <div className="i-headline">URL</div>
          <div>
            <input
              type="text"
              id="url"
              name="url"
              spellCheck="false"
              autoComplete="off"
              className="input"
              value={url}
              onChange={onChangeUrl}
              required
              />
          </div>
        </div>
        <div>
          <div className="i-headline">USERNAME</div>
          <div>
            <input
              type="text"
              id="username"
              name="username"
              spellCheck="false"
              autoComplete="off"
              className="input"
              value={username}
              onChange={onChangeUsername}
              required
              />
          </div>
        </div>
      </div>
      <div>
        <h2 style={{marginBottom: "0px", textDecoration: "underline"}}>&nbsp;&nbsp;YOUR PASSWORD:&nbsp;&nbsp;</h2>
      </div>
      <div style={{borderBottom: "1px solid black", paddingBottom: "5px"}}>
        <div style={{position: "relative", height: "20px"}}>
          <button 
            className="button"
            type="button" 
            style={{position: "absolute", right: "10px"}}
            onClick={() => navigator.clipboard.writeText(hash)}
          >
            <Copy color="black" size={30} />
          </button>
        </div>
        <div>
          {hash}
        </div>
      </div>
        <div style={{textAlign: "center", marginTop: "40px"}}>
        <p>Generated by hashing:</p>
        <h3>
        [**PASSPHRASE**, {url}, {username}]
        </h3>
        <p>With SHA3-256</p>
        </div>
    </section>
  );
};

export default Popup;
