import React, {Fragment, useRef} from 'react';

import BorderedInput from '../components/BorderedInput';

const SignForm = ({form, createChangeTextHandler, isSignUp, onSubmit}) => {
  const passwordRef = useRef();
  const confirmPasswrodRef = useRef();

  return (
    <Fragment>
      <BorderedInput
        placeholder="이메일"
        hasMarginBottom
        value={form.email}
        onChangeText={createChangeTextHandler('email')}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <BorderedInput
        placeholder="비밀번호"
        hasMarginBottom={isSignUp}
        value={form.password}
        onChangeText={createChangeTextHandler('password')}
        secureTextEntry
        ref={passwordRef}
        returnKeyType={isSignUp ? 'next' : 'done'}
        onSubmitEditing={() => {
          if (isSignUp) {
            confirmPasswrodRef.current.focus();
          } else {
            onSubmit();
          }
        }}
      />
      {isSignUp && (
        <BorderedInput
          placeholder="비밀번호 확인"
          value={form.confirmPasswrod}
          onChangeText={createChangeTextHandler('confirmPasswrod')}
          secureTextEntry
          ref={confirmPasswrodRef}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
      )}
    </Fragment>
  );
};

export default SignForm;
