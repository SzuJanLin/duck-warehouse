const apiUrl = "http://localhost:5000/";


export const fetchDucks = async () => {
    try {
      const response = await fetch(apiUrl + "api/ducks");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ducks:', error);
      return [];
    }
  };


export const addOrUpdateDuck = async (duckData) => {
    try {
      const response = await fetch(`${apiUrl}api/ducks/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duckData),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to add or update duck');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };


  export const editDuck = async (duckData) => {
    try {
       const {id, price, quantity} = duckData;
      const response = await fetch(`${apiUrl}api/ducks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, quantity }),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to edit duck');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
  export const deleteDuckListing = async (id) => {
    try {
      const response = await fetch(`${apiUrl}api/ducks/${id}/delete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to delete duck');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  export const deleteDuck = async (id) => {
    try {
      const response = await fetch(`${apiUrl}api/ducks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to delete duck');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
  
  