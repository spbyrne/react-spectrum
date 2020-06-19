/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {mergeProps} from '@react-aria/utils';
import React, {HTMLAttributes, MutableRefObject, RefObject, useContext, useEffect} from 'react';

interface DOMPropsResponderProps extends HTMLAttributes<HTMLElement> {
  /**
   * Element that the props are passed to.
   */
  ref?: RefObject<HTMLElement>
}

interface DOMPropsResponderContext extends HTMLAttributes<HTMLElement> {
  /**
   * Prevents the context from being used multiple times.
   */
  register(): void,
  /**
   * The element the props are being passed to.
   */
  ref?: MutableRefObject<HTMLElement>
}

export const DOMPropsResponderContext = React.createContext<DOMPropsResponderContext>(null);

/**
 * Gets props off the PropsResponderContext.
 */
export function useDOMPropsResponderContext(props: DOMPropsResponderProps): DOMPropsResponderProps {
  // Consume context from <DOMPropsResponder> and merge with props.
  let context = useContext(DOMPropsResponderContext);
  if (context) {
    let {register, ...contextProps} = context;
    props = mergeProps(contextProps, props);
    register();
  }

  // Sync ref from <DOMPropsResponder> with ref passed to the useHover hook.
  useEffect(() => {
    if (context && context.ref) {
      context.ref.current = props.ref.current;
      return () => {
        context.ref.current = null;
      };
    }
  }, [context, props.ref]);

  return props;
}
