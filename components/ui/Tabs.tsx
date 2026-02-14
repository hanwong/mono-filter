import React, { createContext, useContext, useState } from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({
  defaultValue,
  children,
  style,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
}: {
  defaultValue: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const onValueChange = controlledOnValueChange ?? setUncontrolledValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View style={style}>{children}</View>
    </TabsContext.Provider>
  );
};

export const TabsList = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const TabsTrigger = ({
  value,
  children,
  style,
}: {
  value: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.value === value;

  return (
    <TouchableOpacity
      style={[
        { paddingVertical: 10, marginRight: 20 },
        isActive && { borderBottomWidth: 2, borderBottomColor: "#000" },
        style,
      ]}
      onPress={() => context.onValueChange(value)}
    >
      <Text
        style={{
          fontSize: 16,
          color: isActive ? "#000" : "#888",
          fontWeight: isActive ? "bold" : "normal",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const TabsContent = ({
  value,
  children,
  style,
}: {
  value: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  // Keep mounted but hidden
  return (
    <View
      style={[style, { display: context.value === value ? "flex" : "none" }]}
    >
      {children}
    </View>
  );
};
