import { getGithubData } from "./actions";
import Index from "./components";

const Portfolio = async () => {
  const data = await getGithubData();
  console.log(data);
  
  return <Index />;
};

export default Portfolio;
