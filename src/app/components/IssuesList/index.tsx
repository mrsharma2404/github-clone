"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import IssueIcon from "@/app/icons/IssueIcon";
import { useInView } from "react-intersection-observer";
import { issuesDummyData } from "@/app/helpers/issuesDummyData";
import { darkenColor, getContrastYIQ } from "@/app/helpers/color";

interface Issue {
  id: number;
  number: number;
  title: string;
  labels: { name: string; color: string; id: number }[];

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
        <div className={styles.header}>
          <div className={styles.icon}>
            <IssueIcon color="black" />
          </div>
          <div className={styles.title}>
            617 Open
            {/* TODO: dummy data */}
          </div>
        </div>
        {issues.map((issue) => {
          return (
            <div className={styles.issueBox} key={issue.id}>
              <div className={styles.icon}>
                <IssueIcon color="green" />
              </div>

              <div>
                <div className={styles.firstRow}>
                  <h3 className={styles.issueName}>{issue.title}</h3>
                  <div className={styles.labelsWrapper}>
                    {issue.labels.map((label) => {
                      const backgroundColor = `#${label.color}`;
                      const textColor = getContrastYIQ(label.color);
                      const borderColor = darkenColor(label.color);
                      return (
                        <div
                          style={{
                            background: backgroundColor,
                            color: textColor,
                            border: `1px solid ${borderColor}`,
                          }}
                          className={styles.label}
                          key={label.id}
                        >
                          {label.name}
                        </div>
                      );
                    })}{" "}
                  </div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.issueNumber}>#{issue.number}</div>
                </div>
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
