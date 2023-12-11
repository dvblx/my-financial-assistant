import React, { useState } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'


const postData = async () => {
        fetch(`/api/bank-account/${noteId}/email_confirmation`, {
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body:JSON.stringify({'confirmation_code':code})
      })
    }

export default function ConfirmEmail() {
    const [code, setCode] = useState('');
    return (
        <div>
            <Form className="create-form">
                <Form.Field>
                    <label>First Name</label>
                    <input placeholder='Код подтверждения' onChange={(e) => setFirstName(e.target.value)}/>
                </Form.Field>
                <Button onClick={postData} type='submit'>Submit</Button>
            </Form>
        </div>
    )
}