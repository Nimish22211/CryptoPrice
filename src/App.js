import React, { useEffect, useState, useRef } from 'react'
import './App.css'
function App() {
    const [coinsList, setCoinsList] = useState([]);
    const [prevData, setPrevData] = useState([]);
    const prevDataRef = useRef(prevData);

    let [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        prevDataRef.current = prevData;
    }, [prevData]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false').then(res => res.json())
            const prevData = prevDataRef.current;
            setCoinsList(response);
            setPrevData(prevData);
        }
        fetchData()
        async function fetchData2() {
            const prevData = prevDataRef.current;
            const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false').then(res => res.json())
            for (let i = 0; i < prevData.length; i++) {
                if (res[i].current_price > prevData[i].current_price) {
                    let coin = document.getElementById(`${prevData[i].id}`)
                    coin.classList.add('bgyellow')
                    setTimeout(() => {
                        coin.classList.remove('bgyellow')
                    }, 1000)
                } else if (res[i].current_price < prevData[i].current_price) {
                    let coin = document.getElementById(`${prevData[i].id}`)
                    console.log(coin)
                    coin.classList.add('bgred')

                    setTimeout(() => {
                        coin.classList.remove('bgred')
                    }, 1000)
                }
            }
            setPrevData(res);
            setCoinsList(res);
        }
        setInterval(() => {
            fetchData2()
        }, 10000)
    }, [])
    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth)
        })
    })

    // console.log(prevCoins)
    return (
        <div className="outerDiv">
            <header>
                <h2>Crypto Price</h2>
                <div className="photos">
                    <img src="twitter profile-modified.png" width="50px" height="50px" alt="Profile snap" />
                    <p style={{ marginLeft: '15px' }}>Nimish Bandha</p>
                </div>
            </header>
            <main className="cryptoBox">
                <table className="cryptoTable">
                    <thead className="tableHead" >
                        <tr>
                            <th data-value="crypto">Asset Name</th>
                            <th data-value="crypto">Value</th>
                            {width >= 1440 && <th data-value="crypto">Best 24H</th>}
                            {width >= 1440 && <th data-value="crypto">Worse 24H</th>}
                            <th data-value="crypto">24H Change</th>
                        </tr>
                    </thead>
                    <tbody>

                        {coinsList.map(coin =>
                            <tr key={coin.id}>
                                <td id={coin.id} className="coinSymbol"><img src={coin.image} alt={coin.name} />
                                    {coin.name}</td>
                                <td id={coin.id} >$ {coin.current_price}</td>
                                {width >= 1440 && <td id={coin.id} className="green">$ {coin.high_24h}</td>}
                                {width >= 1440 && <td id={coin.id} className="worse">$ {coin.low_24h}</td>}
                                <td id={coin.id} className={coin.price_change_24h > 0 ? 'green' : 'red'}>$ {coin.price_change_24h}</td>
                            </tr>)}
                    </tbody>
                </table>
            </main>
        </div>
    )
}

export default App
