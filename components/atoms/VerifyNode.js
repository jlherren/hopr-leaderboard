import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import {
  CERAMIC_IDX_ALIASES,
  CERAMIC_IDX_HOPR_NAMESPACE,
} from "../../constants/ceramic";
import { HOPR_ADDRESS_CHAR_LENGTH } from "../../constants/hopr";

const truncate = (address) => `${address.slice(0, 5)}...${address.slice(-5)}`;

const NodeTable = ({ nodes = [] }) => (
  <div className="box-container-table" style={{ height: "100%" }}>
    <table>
      <thead>
        <tr>
          <th>HOPR node</th>
          <th>Ethereum address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(nodes).map((node) => (
          <tr>
            <td>{truncate(node)}</td>
            <td>{truncate(nodes[node])}</td>
            <td><button disabled>Fund</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const VerifyNode = ({ idx }) => {
  const { account } = useEthers();
  const [inputValue, setInputValue] = useState();
  const [nodes, setNodes] = useState({});
  const [profile, setProfile] = useState({});
  const [error, setError] = useState();

  const loadIDX = async () => {
    const profile = await idx.get("basicProfile", `${account}@eip155:137`);
    setProfile(profile);
    setNodes(profile[CERAMIC_IDX_HOPR_NAMESPACE])
  };
  const addHOPRNodeToIDX = async () => {
    // NB: We can’t fully validate HOPR node address until it’s stored in IDX
    // since our hopr-utils had been tailored for node.js and not browser usage.
    if (inputValue.length != HOPR_ADDRESS_CHAR_LENGTH) {
      setError("Invalid HOPR address. Please try with a different value.");
    } else {
      const { alias1 } = CERAMIC_IDX_ALIASES;
      const hoprNodeInfo = { [inputValue]: inputValue };
      await idx.set(alias1, { [CERAMIC_IDX_HOPR_NAMESPACE]: hoprNodeInfo });
      const response = await fetch(`/api/faucet/nodes/${account}`, {
        body: JSON.stringify({ node: inputValue }),
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      }).then((res) => res.json());
      console.log("RESPONSE", response)

      if (response.status === "ok") {
        await idx.set(alias1, {
          [CERAMIC_IDX_HOPR_NAMESPACE]: {
            [response.peerId.id]: response.ethAddress,
          },
        });
      } else {
        await idx.set(alias1, {
          [CERAMIC_IDX_HOPR_NAMESPACE]: {
            [inputValue]: 'invalid',
          },
        })
      }
      console.log("RESPONSE", response);
      loadIDX();
    }
  };
  useEffect(() => {
    loadIDX();
  }, []);
  return (
    <div display="flex" style={{ margin: "10px 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <p>
          <b>Add HOPR node</b> Faucet
        </p>
        <small>
          By adding a HOPR node, you can request funds from our faucet. You can
          add any HOPR node, even if it’s not controlled by you. By clicking
          “Add HOPR node”, we will validate the given node and obtain its address.
        </small>
        <br />
        <br />
        <small>
          If your address is part of our staking program, we'll be funding your
          address with both MATIC (0.01) and (m)HOPR funds (10), otherwise we’ll
          only provide you with (m)HOPR funds. You can fund up to (10) nodes.
        </small>
        <div display="block" style={{ marginTop: "5px" }}>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="16Uiu2HA..."
            style={{ width: "98%", padding: "5px" }}
          />
        </div>
        <div>
          <button
            style={{
              backgroundColor: "rgba(248, 114, 54, 0.5)",
              marginTop: "5px",
            }}
            onClick={() => {
              addHOPRNodeToIDX();
            }}
          >
            Add node for funding.
          </button>
          {error && <small style={{ marginLeft: "5px" }}>{error}</small>}
        </div>
        <NodeTable nodes={profile[CERAMIC_IDX_HOPR_NAMESPACE]} />
      </div>
      <div>
        <p>
          <b>Verify HOPR node</b>
        </p>
        <small>
          By verifying your node, you are elegible to NFT rewards based on the
          on-chain actions your node(s) execute(s). You can only verify nodes
          you control. Copy your Ethereum address and go to the admin interface
          of your HOPR node. Using the command “sign”, sign your copied address
          and paste the result here. e.g. “sign
          0x2402da10A6172ED018AEEa22CA60EDe1F766655C”
        </small>
        <br />
        <br />
        <small>
          Copy and paste the contents of the sign function in the following text
          field and click on “Verify your HOPR node in IDX”. If valid, your node
          will then be shown as verified in our network with your Ethereum
          address.
        </small>
        <div display="block" style={{ marginTop: "5px" }}>
          <textarea
            placeholder="0x304402203208f46d1d25c4939760..."
            rows="3"
            display="block"
            style={{ width: "98%", padding: "5px" }}
          />
        </div>
        <button style={{ backgroundColor: "rgba(248, 114, 54, 0.5)" }}>
          Verify node for rewards.
        </button>
      </div>
    </div>
  );
};
