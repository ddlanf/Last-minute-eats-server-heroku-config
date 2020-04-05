const EmailsService = {
    getAllEmails(db){
        return db
            .from('last_minute_eats_emails as email')
            .select(
                'email.id',
                'email.email',
            )   
    },
    getById(db, id) {
        return EmailsService.getAllEmails(db)
          .where('id', id)
          .first()
    },
    insertEmail(db, newEmail) {
        return db
          .insert(newEmail)
          .into('last_minute_eats_emails')
          .returning('*')
          .then(([email]) => email)
          .then(email =>
            EmailsService.getById(db, email.id)
          )
    }
}

module.exports = EmailsService