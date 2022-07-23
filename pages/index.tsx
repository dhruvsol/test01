import type { NextPage } from "next";
import Routes from "../libs/route.json";
import Factory from "../libs/factory.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
const Home: NextPage = () => {
  const handle = new ethers.Contract(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    Routes
  );
  const [dai, setDai] = useState<any>();
  const [address, setAddress] = useState<string>();
  const [ammount, setAmmount] = useState<number>();
  const {
    WETH,
    Fetcher,
    Route,
    Trade,
    TokenAmount,
    TradeType,
    Percent,
    factory,
  } = handle;
  const Provider = ethers.getDefaultProvider("rinkeby");
  console.log(factory);

  useEffect(() => {
    const HandleConnect = async () => {
      if (typeof window != undefined) {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const add = await signer.getAddress();
        setAddress(add);
        console.log(address);
      }
    };
    HandleConnect();
  }, [address]);
  // const wal = new ethers.Wallet(ethers.utils.isBytesLike(address), Provider);
  async function swapTokens(
    token1: { address: any },
    token2: { address: any },
    amount: { toString: () => string },
    slippage = "50"
  ) {
    try {
      //@ts-ignore
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/4c02a50aa0c04067aa1bb106b0a7e6e9"
      );

      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      console.log(provider.getBalance(signer.getAddress()));

      const pair = await Fetcher.fetchPairData(token1, token2, Provider);
      const route = await new Route([pair], token2);
      let amountIn = ethers.utils.parseEther(amount.toString());
      //@ts-ignore
      amountIn = amountIn.toString();

      const path = [token2.address, token1.address];
      const to = address;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const rawTxn = await handle.populateTransaction.swapExactETHForTokens(
        ammount,
        path,
        to,
        deadline
      );

      let sendTxn = (await signer).sendTransaction(rawTxn);
      console.log(sendTxn);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div>
        <div>
          <input
            onChange={(e) => setAmmount(parseInt(e.target.value))}
            type="number"
            placeholder="Enter Ammount"
          />
        </div>
        <button>Swap</button>
      </div>
    </>
  );
};

export default Home;
