const K_SUFFIX_REGEX = /\.?0+K$/;
const M_SUFFIX_REGEX = /\.?0+M$/;

export const formatTokens = (tokens: number | null | undefined) => {
	if (tokens === null || tokens === undefined || Number.isNaN(tokens)) {
		return "0";
	}
	if (tokens < 1000) {
		return tokens.toString();
	}
	if (tokens < 1_000_000) {
		return `${(tokens / 1000).toFixed(2)}K`.replace(K_SUFFIX_REGEX, "K");
	}
	return `${(tokens / 1_000_000).toFixed(2)}M`.replace(M_SUFFIX_REGEX, "M");
};
