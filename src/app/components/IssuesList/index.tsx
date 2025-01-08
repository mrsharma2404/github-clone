"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import IssueIcon from "@/app/icons/IssueIcon";
import { useInView } from "react-intersection-observer";
import { issuesDummyData } from "@/app/helpers/issuesDummyData";

interface Issue {
  id: number;
  number: number;
  title: string;
  // Add other properties if needed from the API response
}

function IssuesList() {
  const { ref, inView } = useInView();

  const [issues, setIssues] = useState<Issue[]>([]);

  const [reachedEnd, setReachedEnd] = useState(false);

  const fetchIssues = async ({
    offset = 0,
    limit = 20,
  }: {
    offset?: number;
    limit?: number;
  }) => {
    // Calculate the page number (GitHub API uses 1-based indexing)
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(
      `https://api.github.com/repos/facebook/react/issues?page=${page}&per_page=${limit}`
    );

    // for now our github api does not include total count in the response
    // so we are just checking if the response is not ok then we can stop fetching
    if (!response.ok) {
      console.log({ response });
      setReachedEnd(true);
      if (issues.length === 0) {
        // adding dummy data to show the UI if API fails due to rate limit
        setIssues(issuesDummyData);
      }

      return;
    }
    const data = await response.json();
    console.log({ data });
    setIssues([...issues, ...data]);
  };

  useEffect(() => {
    fetchIssues({ offset: 0, limit: 20 });
  }, []);

  useEffect(() => {
    if (inView)
      fetchIssues({
        offset: issues.length,
        limit: 40,
      });
  }, [inView]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {issues.map((issue, index) => {
          return (
            <div className={styles.issueBox} key={index}>
              <div className={styles.row}>
                <div className={styles.icon}>
                  <IssueIcon />
                </div>
                <h3 className={styles.issueName}>{issue.title}</h3>
              </div>
              <div className={styles.secondRow}>
                <div className={styles.issueNumber}>#{issue.number}</div>
              </div>
            </div>
          );
        })}
      </div>
      {!reachedEnd && <div ref={ref}>please wait, fetching data....</div>}
    </div>
  );
}

export default IssuesList;
