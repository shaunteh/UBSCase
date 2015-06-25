app.controller('PortfolioController', function($scope) {
    $scope.portfolio = {
        investments: [
            {
                type: 'Liquidity (incl. FX Products)',
                value: 12897235.00,
            },
            {
                type: 'Bonds',
                value: 500502.02,
            },
            {
                type: 'Equities',
                value: 7546422.13,
            },
            {
                type: 'Alternative Investment',
                value: 80302.06,
            },
            {
                type: 'Real Estate',
                value: 12057500.00,
            },
            {
                type: 'Precious Metals',
                value: 12500.00,
            },
            {
                type: 'Others',
                value: 35043.00,
           },
        ],
        totalValue: 33129504.21
    };

});