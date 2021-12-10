console.log("Hello");

const numbers = [1, 2, 3, 4, 5];

function printEven() {

    numbers.forEach(function (el) {
        if (el % 2 === 0) {
            console.log(el);
        }
    })
}


printEven()


function  dMoviesList() {
    const dmovie = [
        {
            title: 'Aadukalam',
            score: '90',
            Year: '2011'
        },
        {
            title: 'Thulluvadho Ilamai',
            score: '70',
            Year:  '2002'
        },
        {
            title: 'VIP2',
            score: '80',
            Year:  '2017'
        }
    ]
    
    dmovie.forEach(function(el){
        console.log('Dhanush acted in ' + el.title + ' in the year ' + el.Year );
    })

}

dMoviesList()