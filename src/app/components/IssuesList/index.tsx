"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import IssueIcon from "@/app/icons/IssueIcon";

function IssuesList() {
  const [issues, setIssues] = useState<any>([]);
  const fetchIssues = async () => {
    const response = await fetch(
      "https://api.github.com/repos/facebook/react/issues"
    );
    const data = await response.json();
    console.log({ data });
    setIssues(data);
  };
  useEffect(() => {
    fetchIssues();
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {issues.map((issue: any, index: number) => {
          return (
            <div className={styles.issueBox} key={index}>
              <div className={styles.row}>
                <IssueIcon />
                <h3 className={styles.issueName}>{issue.title}</h3>
              </div>
              <div className={styles.secondRow}>
                <div className={styles.issueNumber}>#{issue.number}</div>
              </div>
              {/* <p>{item.body}</p> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IssuesList;
