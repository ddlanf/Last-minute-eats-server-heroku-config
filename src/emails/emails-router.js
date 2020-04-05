const express = require('express')
const EmailsService = require('./emails-service')
const emailsRouter = express.Router()
const jsonBodyParser = express.json()
const { requireToken } = require('../middleware/auth-token')
const path = require('path')

emailsRouter
    .route('/')
    .get(requireToken, (req, res, next) => {
       EmailsService.getAllEmails(req.app.get('db'))
            .then(emails => res.json(emails))
    })
    .post(jsonBodyParser, (req, res, next) =>{
        const { email } = req.body

        const newEmail = { email }

        for(let [key, value] of Object.entries(newEmail)){
            if(value == null){
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
        }

        if(!newEmail.email.includes('@') || !newEmail.email.slice(newEmail.email.indexOf('@'), newEmail.email.length).includes('.')){
      
            return res.status(400).json({
             
                error: `Invalid email`
            })
        } 

        EmailsService.insertEmail(req.app.get('db'), newEmail)
            .then(email => {
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${email.id}`))
                .json(email)
        })
        .catch(next)
    })


module.exports = emailsRouter