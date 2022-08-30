import { PolygonLogo } from "./Logos";

const chains = [
  {
    key: "0x89",
    id: "137",
    value: "Polygon Mainnet",
    shortname: "polygon",
    explorer: "https://polygonscan.com",
    opensea: "https://opensea.io/assets/matic",
    icon: <PolygonLogo />,
  },
  {
    key: "0x13881",
    id: "80001",
    value: "Mumbai Testnet",
    shortname: "mumbai",
    explorer: "https://mumbai.polygonscan.com",
    opensea: "https://testnets.opensea.io/assets/mumbai",
    icon: <PolygonLogo />,
  },
];

export default chains