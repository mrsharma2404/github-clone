import IssuesList from "./components/IssuesList";

export default function Home() {
  return (
    <div>
      <div>NOTE - API Call Rate Limit 60 per hour || Use it Carefully</div>
      <IssuesList />
    </div>
  );
}
