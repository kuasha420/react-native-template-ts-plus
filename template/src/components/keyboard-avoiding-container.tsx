import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

export interface KeyboardAvoidingContainerProps
  extends React.ComponentProps<typeof ScrollView> {
  edges?: Edge[];
  mode?: 'padding' | 'margin';
  header?: React.ReactNode;
  keyboardVerticalOffset?: number;
  containerStyle?: ViewStyle;
}

const KeyboardAvoidingContainer = React.forwardRef<
  React.ElementRef<typeof ScrollView>,
  KeyboardAvoidingContainerProps
>(
  (
    {
      children,
      edges,
      mode,
      header,
      keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0,
      containerStyle,
      ...rest
    },
    ref
  ) => {
    return (
      <SafeAreaView edges={edges} mode={mode} style={[styles.safeareaview, containerStyle]}>
        {header}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            ref={ref}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollview}
            {...rest}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
);

const styles = StyleSheet.create({
  safeareaview: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});

export default KeyboardAvoidingContainer;
