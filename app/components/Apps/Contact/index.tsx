import { useState, useEffect } from "react";
import { getGithubData } from "@/app/actions";
import { GitData, WindowSizeProps } from "../../types";
import Link from "next/link";
import useGridClasses from "@/app/Hooks/useGridClasses";

// Example of grid rules
const gridRules = {
  profile: {
    "col-span": {
      mobile: "12",   // Full width for mobile
      tablet: "6",    // Half width for tablet
      desktop: "4",   // One third width for desktop
    },
  },
  repos: {
    "col-span": {
      mobile: "12",   // Full width for mobile
      tablet: "6",    // Half width for tablet
      desktop: "8",   // Two thirds width for desktop
    },
  },
  repoItem: {
    "col-span": {
      mobile: "12",   // Full width for mobile
      tablet: "6",    // Half width for tablet
      desktop: "4",   // One third width for desktop
    },
  },
};

export default function Contact({ windowSize }: WindowSizeProps) {
  const [state, setState] = useState<GitData>({ profile: null, repos: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getGithubData();
    setState(result);
  };

  // Get dynamic grid classes based on window size
  const gridClasses = useGridClasses(windowSize, gridRules);
  
  return (
    <div className="grid gap-2 p-3">
      <div className={gridClasses.profile}>
        <div className="flex bg-gray-800 p-6 rounded-lg flex-col items-center">
          <img
            className="w-40 h-40 rounded-lg"
            src={state.profile?.avatar_url}
            alt="Profile"
          />
          <div className="mt-4 text-center md:text-left">
            <h2 className="text-xl font-semibold">{state.profile?.name}</h2>
            <p className="text-gray-200 text-xs mt-2">{state.profile?.bio}</p>
            <div className="mt-1">
              <Link
                href={state.profile?.blog || "#"}
                target="_blank"
                className="text-blue-500 hover:underline text-xs"
              >
                {state.profile?.blog}
              </Link>
              <p className="text-gray-200 text-xs">@_programmer_ashish_</p>
            </div>
          </div>
        </div>
      </div>

      <div className={gridClasses.repos}>
        <div className="grid gap-2">
          {state.repos.map((repo, index) => (
            <div key={index} className={gridClasses.repoItem}>
              <div className="p-4 bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
                <h4 className="font-medium text-sm sm:text-lg">{repo.name}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{repo?.description || "NA"}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400 text-xs sm:text-sm mr-2">
                    {repo.language}
                  </span>
                  {repo?.license && (
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {repo?.license?.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
