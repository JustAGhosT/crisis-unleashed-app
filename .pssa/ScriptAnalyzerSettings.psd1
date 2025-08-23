@{
    # Minimal ScriptAnalyzer settings
    Severity = @('Error','Warning')
    IncludeDefaultRules = $true
    Rules = @{
        PSUseApprovedVerbs       = @{ Enable = $true }
        PSUseConsistentIndentation = @{ Enable = $true; IndentationSize = 2; PipelineIndentation = 'IncreaseIndentationAfterEveryPipeline' }
        PSAvoidUsingWriteHost    = @{ Enable = $true }
    }
}
