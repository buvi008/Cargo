import Cookies from 'universal-cookie';

const cookies = new Cookies();


const removeShop = async (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`http://${window.location.hostname}/shop`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: cookies.get('sid'),
        },
        body: JSON.stringify({_id})
      })
      if (res.status === 200) {
        return resolve(_id);
      }
      return reject(await res.json());
    } catch (error) {
      return reject(error);
    }
  })

}

export {
  removeShop,
}
