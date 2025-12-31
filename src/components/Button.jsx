import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { THEME } from '../constants/theme';

const Button = ({
    title,
    onPress,
    variant = 'primary', // primary, secondary, outline, ghost
    size = 'md', // sm, md, lg
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return THEME.COLORS.bgCard;
        switch (variant) {
            case 'primary':
                return THEME.COLORS.secondary;
            case 'secondary':
                return THEME.COLORS.bgCard;
            case 'outline':
                return 'transparent';
            case 'ghost':
                return 'transparent';
            default:
                return THEME.COLORS.secondary;
        }
    };

    const getTextColor = () => {
        if (disabled) return THEME.COLORS.textMuted;
        switch (variant) {
            case 'primary':
                return THEME.COLORS.bg;
            case 'secondary':
                return THEME.COLORS.secondary;
            case 'outline':
                return THEME.COLORS.secondary;
            case 'ghost':
                return THEME.COLORS.text;
            default:
                return THEME.COLORS.bg;
        }
    };

    const getBorder = () => {
        if (variant === 'outline') {
            return {
                borderWidth: 1,
                borderColor: disabled ? THEME.COLORS.textMuted : THEME.COLORS.secondary,
            };
        }
        return {};
    };

    const getPadding = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'lg':
                return { paddingVertical: 16, paddingHorizontal: 32 };
            default:
                return { paddingVertical: 12, paddingHorizontal: 24 };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm':
                return THEME.SIZES.sm;
            case 'lg':
                return THEME.SIZES.lg;
            default:
                return THEME.SIZES.base;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderRadius: THEME.RADIUS.md,
                    ...getPadding(),
                    ...getBorder(),
                },
                disabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: getTextColor(),
                            fontSize: getFontSize(),
                            fontWeight: '600',
                        },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: THEME.FONTS.sans,
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
});

export default Button;
