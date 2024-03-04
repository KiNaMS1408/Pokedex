function rada(pokemonDetails) {
    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    let stats = [];
    
    for (let i = 0; i < pokemonDetails['stats'].length; i++) {
        stats.push(pokemonDetails['stats'][i]['base_stat']);
    }

    myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['HP', 'AK', 'V', 'G', 'S-AK', 'S-V'],
            datasets: [{
                label: 'Werte',
                data: stats,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}