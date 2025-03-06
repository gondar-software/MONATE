import { useEffect, useState } from 'react';
import { FormDatePicker1, FormHeader1, FormSelect1, FormSubmitButton1, FormTextField1, ImageUploader } from '@app/components';
import { genderTypes } from '@app/constants';
import { useUserInfo } from '@app/global';

export const BookCard = (props: any) => {
    const userInfo = useUserInfo();

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [avatar, setAvatar] = useState<any>(userInfo?.avatar ? 'original' : null);
    const [githubUrl, setGithubUrl] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    useEffect(() => {
        const genderMap = Object.entries(genderTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});

        if (!userInfo) {
            return;
        }
    
        setFirstName(userInfo.firstName);
        setMiddleName(userInfo.middleName);
        setLastName(userInfo.lastName);
        setGender(genderMap[userInfo.gender]);
        setDob(userInfo.dob);
        setAddress1(userInfo.address1);
        setAddress2(userInfo.address2);
        setCity(userInfo.city);
        setState(userInfo.state);
        setZipCode(userInfo.zipCode);
        setCountry(userInfo.country);
        setAvatar(userInfo.avatar ? 'original' : null);
        setGithubUrl(userInfo.githubUrl);
        setPhoneNumber(userInfo.phoneNumber);
    }, [userInfo]);

    const handleAvatarUpload = (file: File) => {
        setAvatar(file);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit({
            firstName,
            middleName,
            lastName,
            gender,
            dob,
            address1,
            address2,
            city,
            state,
            zipCode,
            country,
            avatar,
            githubUrl,
            phoneNumber,
        });
    };

    return (
        <div className="w-full max-w-sm p-4 mt-32 mb-32 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormHeader1>
                    Your information
                </FormHeader1>
                <div className='flex flex-col items-center'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center">
                        Avatar
                    </label>
                    <ImageUploader initUrl={userInfo?.avatar} className='w-40 h-40' maxWidth={2048} maxHeight={2048} onImageUpload={handleAvatarUpload} />
                </div>
                <FormTextField1
                    label="First Name"
                    type="firstName"
                    name="firstName"
                    id="firstName"
                    value={firstName}
                    onChange={(e: any) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                />
                <FormTextField1
                    label="Middle Name"
                    type="middleName"
                    name="middleName"
                    id="middleName"
                    value={middleName}
                    onChange={(e: any) => setMiddleName(e.target.value)}
                    placeholder=""
                />
                <FormTextField1
                    label="Last Name"
                    type="lastName"
                    name="lastName"
                    id="lastName"
                    value={lastName}
                    onChange={(e: any) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                />
                <FormSelect1
                    label="Gender *"
                    name="gender"
                    id="gender"
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    placeholder="Select your gender"
                    options={
                        [
                            { value: 'male', label: 'Male' }, 
                            { value: 'female', label: 'Female' }, 
                            { value: 'other', label: 'Other' }, 
                            { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                        ]}
                />
                <FormDatePicker1
                    label="DOB *"
                    type="text"
                    id="dob"
                    name="dob"
                    placeholder="2002-06-15"
                    value={dob}
                    onChange={(e: any) => setDob(e.target.value)}
                />
                <FormTextField1
                    label="Address1"
                    type="address1"
                    name="address1"
                    id="address1"
                    value={address1}
                    onChange={(e: any) => setAddress1(e.target.value)}
                    placeholder=""
                    required
                />
                <FormTextField1
                    label="Address2"
                    type="address2"
                    name="address2"
                    id="address2"
                    value={address2}
                    onChange={(e: any) => setAddress2(e.target.value)}
                    placeholder=""
                />
                <FormTextField1
                    label="City"
                    type="city"
                    name="city"
                    id="city"
                    value={city}
                    onChange={(e: any) => setCity(e.target.value)}
                    placeholder=""
                    required
                />
                <FormTextField1
                    label="State"
                    type="state"
                    name="state"
                    id="state"
                    value={state}
                    onChange={(e: any) => setState(e.target.value)}
                    placeholder=""
                    required
                />
                <FormTextField1
                    label="Zip Code"
                    type="number"
                    name="zipCode"
                    id="zipCode"
                    value={zipCode}
                    onChange={(e: any) => setZipCode(e.target.value)}
                    aria-describedby="helper-text-explanation" 
                    placeholder="90012" 
                    required
                />
                <FormTextField1
                    label="Country"
                    type="country"
                    name="country"
                    id="country"
                    value={country}
                    onChange={(e: any) => setCountry(e.target.value)}
                    placeholder=""
                    required
                />
                <FormTextField1
                    label="Github URL"
                    type="githubUrl"
                    name="githubUrl"
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e: any) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    required
                />
                <FormTextField1
                    label="Phone Number"
                    type="number"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e: any) => setPhoneNumber(e.target.value)}
                    placeholder="+12016203178" 
                    required
                />
                <FormSubmitButton1
                    submitting={props.saving}
                >
                    Save
                </FormSubmitButton1>
            </form>
        </div>
    )
}

export default BookCard;