
export type Method = "get" | "post" | "patch" | "delete";

export interface RouterRule {

    /** List of enabled methods.
     *
     * List of methods that can be used on requests directed to individual
     * resources or resource collections under control of this router rule.
     */
    enabled?: Array<Method>;
}