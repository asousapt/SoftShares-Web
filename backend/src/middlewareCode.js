const express = require('express');

const redirecionaLandingPage = (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 401) {
            return res.redirect('/'); // Redireciona para a landing page
        }
        originalSend.apply(res, arguments);
    };
    
    next();
};

module.exports = redirecionaLandingPage;
