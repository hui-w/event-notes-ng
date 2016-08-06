app.controller('mortgageController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
    $scope.principal = 10000;
    $scope.annualRate = 0.1;
    $scope.period = 12;
    $scope.reinvestRate = 0.08;
    $scope.payment = {
        fixedPayment: {
            monthlyPayment: 0,
            totalInterest: 0,
            actualRate: 0
        },
        reinvestment: {
            totalInterest: 0
        },
        summarize: {
            totalInterest: 0,
            actualRate: 0
        },
        months: [
            /*{
                principal: 0,
                interest: 0,
                balance: 0,
                reinvestEarning: 0
            }*/
        ]
    }

    $scope.calculate = function() {
        var a = $scope.principal;
        var i = $scope.annualRate / 12;
        var n = $scope.period;
        var c = $scope.reinvestRate / 12;

        //monthly payment
        var b = (a * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);

        //total interest
        var y = b * n - a;

        //fixed payment
        $scope.payment.fixedPayment = {
            monthlyPayment: b,
            totalInterest: y,
            actualRate: (y / a) / (n / 12)
        };

        var revestmentTotalInterest = 0;

        //monthly payments
        $scope.payment.months = [];

        for (var j = 0; j < n; j++) {
            var interest = (a * i - b) * Math.pow(1 + i, j) + b;
            var principal = b - interest;
            var balance = j == 0 ? a - principal : $scope.payment.months[j - 1].balance - principal;
            var reinvestEarning = b * (Math.pow(1 + c, n - 1 - j) - 1);
            revestmentTotalInterest += reinvestEarning;
            if (Math.abs(balance) < 0.01) {
                balance = 0;
            }
            $scope.payment.months.push({
                principal: principal,
                interest: interest,
                balance: balance,
                reinvestEarning: reinvestEarning
            });
        };

        //reinvestment
        $scope.payment.reinvestment = {
            totalInterest: revestmentTotalInterest
        };

        //summarize
        $scope.payment.summarize = {
            totalInterest: y + revestmentTotalInterest,
            actualRate: ((y + revestmentTotalInterest) / a) / (n / 12)
        };
    }
}]);