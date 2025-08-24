const createCustomer = [
    {
        label: 'First Name',
        name: 'firstName',
        type: 'text',
        required: true,
        span: 6,
    },
    {
        label: 'Last Name',
        name: 'lastName',
        type: 'text',
        required: false,
        span: 6,
    },
    {
        label: 'Other Name',
        name: 'otherName',
        type: 'text',
        required: false,
        span: 6,
    },
    {
        label: 'Business name of the entity in form',
        name: 'businessName',
        type: 'text',
        required: false,
        span: 6,
    },
    {
        label: 'Pet Name',
        name: 'petName',
        type: 'text',
        required: false,
        span: 12,
    },
    {
        label: 'Gender',
        name: 'gender',
        type: 'select',
        options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' }
        ],
        required: true,
        span: 6,
        helperText: 'Please select your gender'
    },
    {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        span: 8,
        helperText: 'Please enter your email address'
    },
    {
        label: 'Phone Number',
        name: 'phoneNumber',
        type: 'tel',
        required: false,
        span: 12,
        helperText: 'Please enter your phone number'
    },
    {
        label: 'Address',
        name: 'address',
        type: 'textArea',
        required: true,
        span: 12,
        helperText: 'Please enter your address'
    },
    {
        label: 'User Type',
        name: 'userType',
        type: 'radio',
        options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Customer', value: 'customer' },
            { label: 'Guest', value: 'guest' },
            { label: 'Super Admin', value: 'super_admin' }
        ],
        required: true,
        span: 6,
        helperText: 'Please select your user type'
    },
    {
        label: 'Date of Birth',
        name: 'dob',
        type: 'date',
        required: true,
        span: 6,
        helperText: 'Please enter your date of birth'
    },
    {
        label: 'Profile Picture',
        name: 'profilePicture',
        type: 'file',
        required: true,
        span: 12,
        helperText: 'Please upload your profile picture'
    },
    {
        label: 'Number of Children',
        name: 'numberOfChildren',
        type: 'number',
        required: false,
        span: 6,
        helperText: 'Please enter the number of children'
    }
]

export default createCustomer;