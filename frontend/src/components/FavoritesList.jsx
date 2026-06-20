import api from '../services/api'

function FavoritesList({ favorites, onUpdate }) {
  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/user/favorites/${id}`)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <h3>Favorites</h3>
      {favorites.length === 0 && <p>No favorites yet.</p>}
      {favorites.map((fav) => (
        <div key={fav.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
          <span>{fav.label || fav.city}</span>
          <button onClick={() => handleRemove(fav.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}

export default FavoritesList
