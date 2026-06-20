function RecentSearches({ history }) {
  return (
    <div style={{ marginTop: '24px' }}>
      <h3>Recent Searches</h3>
      {history.length === 0 && <p>No recent searches.</p>}
      {history.map((item) => (
        <div key={item.id} style={{ marginBottom: '6px' }}>
          {item.city}, {item.country}
        </div>
      ))}
    </div>
  )
}

export default RecentSearches
