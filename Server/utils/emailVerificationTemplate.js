const emailVerificationTemplate = ({ name, url }) => {
  return `
<p>Dear ${name}</p>    
<p>Thank you for registering GloboGreen.</p>   
<a href=${url} style="color:black;background :orange;margin-top : 10px,padding:20px,display:block">
    Verify Email
</a>
`;
};

export default emailVerificationTemplate;
