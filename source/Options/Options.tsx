import * as React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import jsSHA from "jssha";
import './styles.scss';
import {updateExtensionStorage, getExtensionStorage} from '../utils/storage';



const Options = () => {
  const endString = ", example.com, "
  const outputFormat = "B64";
  const [pwd, setPwd] = useState("correct horse battery staple");
  const [username, setUsername] = useState("user@example.com")

  const shaObj = new jsSHA("SHA3-256", "TEXT", { encoding: "UTF8" });
  shaObj.update(pwd+endString+username);
  
  const [hash, setHash] = useState(shaObj.getHash(outputFormat));

  const updateHash = (val:string) => {
    async function updateStorage(): Promise<void>{
      const {storage = {}} = await getExtensionStorage();
      if(storage.passphrase != pwd){
        updateExtensionStorage({passphrase: {
          phrase: pwd,
          updated: Date.now()
        }})
      }
    }

    const shaObj = new jsSHA("SHA3-256", "TEXT", { encoding: "UTF8" });
    const finalString = val + endString + username;
    shaObj.update(finalString);
    setHash(shaObj.getHash(outputFormat));

    updateStorage();
  }
  useEffect(() => {
    updateHash(pwd);
  }, [pwd, username]);


  useEffect(() => {
    async function getSavedStorage(): Promise<void> {
      const {storage = {}} = await getExtensionStorage();
      if(storage.passphrase){
        setPwd(storage.passphrase?.phrase as string)
      }
      if(storage.username){
        setUsername(storage.username as string)
      }
    }

    getSavedStorage();
  },[])

  const onChangePassphrase = (event: ChangeEvent<HTMLInputElement>) => {
    setPwd(event.currentTarget.value);
  };

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    let val = event.currentTarget.value;
    updateExtensionStorage({username: val})
    setUsername(val);
  };



  return (
    <div className="options-wrapper">
      <div className="input-wrapper">
        <div className="box box-margin" style={{maxWidth: "620px"}}>
          <label htmlFor="username">Your passphrase</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            spellCheck="false"
            autoComplete="off"
            value={pwd}
            onChange={onChangePassphrase}
            required
            />
        </div>
        <div className="box box-margin" style={{maxWidth: "620px"}}>
          <label htmlFor="username">Your username</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            spellCheck="false"
            autoComplete="off"
            value={username}
            onChange={onChangeUsername}
            required
            />
        </div>
      </div>
      <div style={{textAlign: "center"}}>
        <div>
          "{pwd}{endString}{username}"
        </div>
        <div style={{ fontSize: "45px"}}>
          ⇩
        </div>
        <div>
          {hash}
        </div>
      </div>
    </div>
  );
};

export default Options;
