import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { CERAMIC_API_URL } from "../../../../../constants/ceramic";
import { uniqueEthAddresses } from "../../../../../constants/missing/1/addresses";

import { utils } from "ethers";

const secretKey = Uint8Array.from(
  utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
);
const provider = new Ed25519Provider(secretKey);
const did = new DID({ provider, resolver: KeyResolver.getResolver() });
const client = new CeramicClient(CERAMIC_API_URL);

export default async (req, res) => {
  await did.authenticate();
  client.setDID(did);

  const resolvedStreams = await Promise.all(
    uniqueEthAddresses.map(async (ethAddress) => {
      const records = await TileDocument.create(
        client,
        null,
        { deterministic: true, family: "hopr-wildhorn", tags: [ethAddress] },
        { anchor: false, publish: false }
      );
      return { ethAddress, streamId: records.id.toString() };
    })
  );

  const streams = resolvedStreams.reduce((acc, val) => {
    acc[val.streamId] = val.ethAddress
    return acc;
  }, {})

  return res.status(200).json({
    status: "ok",
    streams,
  });
};
